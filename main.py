from flask import Flask, send_from_directory, render_template_string
import threading
import subprocess

app = Flask(__name__, static_folder='dist')

# Function to run the Streamlit app
def run_streamlit():
    subprocess.Popen(["streamlit", "run", "streamlit_app.py"])

# Flask route to serve the index.html
@app.route('/')
def serve_index():
    iframe_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Integrated App</title>
    </head>
    <body>
        <h1>Welcome to the Integrated Application</h1>
        <iframe src="http://localhost:8501" width="100%" height="800px" frameborder="0"></iframe>
    </body>
    </html>
    """
    return render_template_string(iframe_html)

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    # Start Streamlit app in a separate thread
    streamlit_thread = threading.Thread(target=run_streamlit)
    streamlit_thread.start()
    # Start Flask app
    app.run(debug=True)
