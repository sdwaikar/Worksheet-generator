import streamlit as st
import vertexai
from vertexai.preview import generative_models
from vertexai.preview.generative_models import GenerativeModel, ChatSession
from fpdf import FPDF
import fitz  # PyMuPDF
import tempfile
import os
import uuid
from streamlit_mic_recorder import speech_to_text

# Apply Custom Styles to Streamlit Components
def apply_custom_styles():
    custom_style = """
    <style>
    /* Style for input, select, and text area elements */
    .stTextInput > div > div > input, .stSelectbox > div > select, .stMultiSelect > div > div > div {
        border: 2px solid #0a4da2;
        border-radius: 5px;
    }

    /* Style for buttons */
    .stButton > button {
        width: 100%;
        background-color: #4CAF50;
        color: white;
    }

    /* Style for text area */
    .stTextArea > div > textarea {
        border-radius: 5px;
    }
    </style>
    """
    st.markdown(custom_style, unsafe_allow_html=True)

# Initialize Vertex AI
project = "worksheet-generator-427421"

try:
    vertexai.init(project=project)
except Exception as e:
    st.error(f"Failed to initialize Vertex AI: {e}")
    st.stop()

config = generative_models.GenerationConfig(temperature=0.4)

# Load model with config
try:
    model = GenerativeModel("gemini-pro", generation_config=config)
except Exception as e:
    st.error(f"Failed to load Vertex AI model: {e}")
    st.stop()

def generate_worksheet(grade_level, topic, question_types):
    try:
        chat = model.start_chat(response_validation=False)
        query = f"Generate a worksheet for {grade_level} level on the topic of {topic}. Include the following types and number of questions: "
        for question_type, num_questions in question_types.items():
            query += f"{num_questions} {question_type}, "
        query = query.rstrip(', ')
        response = chat.send_message(query)
        output = response.candidates[0].content.parts[0].text
        return output
    except Exception as e:
        st.error(f"Failed to generate worksheet: {e}")
        return ""

def split_questions_and_answers(worksheet_text):
    parts = worksheet_text.split("Answer Key:")
    questions = parts[0].strip()
    answer_key = parts[1].strip() if len(parts) > 1 else ""
    return questions, answer_key

def create_pdf(text, title):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    pdf_output = f"{title}.pdf"
    pdf.output(pdf_output)
    return pdf_output

class DocumentProcessor:
    def __init__(self):
        self.pages = []  # List to keep track of pages from all documents
    
    def ingest_documents(self, uploaded_files):
        if uploaded_files:
            for uploaded_file in uploaded_files:
                unique_id = uuid.uuid4().hex
                original_name, file_extension = os.path.splitext(uploaded_file.name)
                temp_file_name = f"{original_name}_{unique_id}{file_extension}"
                temp_file_path = os.path.join(tempfile.gettempdir(), temp_file_name)

                with open(temp_file_path, 'wb') as f:
                    f.write(uploaded_file.getvalue())

                document = fitz.open(temp_file_path)
                for page_num in range(len(document)):
                    page = document.load_page(page_num)
                    page_text = page.get_text()
                    self.pages.append(page_text)

                document.close()
                os.unlink(temp_file_path)
            
            st.write(f"Total pages processed: {len(self.pages)}")

    def ingest_text(self, text):
        self.pages = [text]
        st.write("Text content processed")

def main():
    apply_custom_styles()  # Inject custom CSS styles
    st.title("Worksheet Generator")
    st.write("Generate a worksheet based on any topic or text, or by uploading a document.")

    grade_level = st.selectbox('Grade level:', ['Primary', 'Secondary', 'High School', 'University'], key="grade_level")
    
    files = st.file_uploader("Upload PDF files", type="pdf", accept_multiple_files=True, key="file_uploader")
    pasted_text = st.text_area("Or paste your text here:", height=300, key="pasted_text")

    # Voice-to-text functionality
    st.write("Or use your voice to input the topic:")

    topic_voice = speech_to_text(
        language='en',
        start_prompt="Start recording",
        stop_prompt="Stop recording",
        just_once=True,
        use_container_width=True,
        key='my_stt'
    )

    if topic_voice:
        st.session_state.topic_voice = topic_voice  # Save recognized input into session state

    st.write("Recognized voice input:", st.session_state.get('topic_voice', ''))

    question_types = st.multiselect('Question Types:', ['Fill in the Blanks', 'Multiple Choice Questions', 'True or False Questions', 'Open Ended Questions'], default=['Fill in the Blanks', 'Multiple Choice Questions', 'True or False Questions', 'Open Ended Questions'], key="question_types")

    num_questions = {}
    for qtype in question_types:
        num_questions[qtype] = st.number_input(f'Number of {qtype}', min_value=1, max_value=20, value=5, step=1, key=f"num_{qtype}")

    if st.button('Generate', key="generate"):
        processor = DocumentProcessor()
        content = None
        
        if files:
            processor.ingest_documents(files)
            content = " ".join(processor.pages)
        elif pasted_text:
            processor.ingest_text(pasted_text)
            content = pasted_text or content
        elif st.session_state.get('topic_voice'):
            content = st.session_state['topic_voice']
        
        if content:
            worksheet = generate_worksheet(grade_level, content, num_questions)
            if worksheet:
                questions, answer_key = split_questions_and_answers(worksheet)
                st.session_state.questions = questions
                st.session_state.answer_key = answer_key
                st.session_state.show_answers = False
        else:
            st.error("Please upload a document, paste some text, or use voice input to generate a worksheet.")

    if "questions" in st.session_state and "answer_key" in st.session_state:
        st.markdown("### Questions")
        st.markdown(st.session_state.questions)

        if st.button('Show Answers'):
            st.session_state.show_answers = not st.session_state.show_answers

        if st.session_state.get('show_answers', False):
            st.markdown("### Answer Key")
            st.markdown(st.session_state.answer_key)

        st.download_button("Download Questions as PDF", open(create_pdf(st.session_state.questions, "questions"), "rb"), "questions.pdf", key="download_questions_pdf")
        st.download_button("Download Answer Key as PDF", open(create_pdf(st.session_state.answer_key, "answer_key"), "rb"), "answer_key.pdf", key="download_answer_key_pdf")

if __name__ == "__main__":
    main()
