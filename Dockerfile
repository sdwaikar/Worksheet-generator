FROM python:3.8
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["streamlit", "run", "main.py", "--server.port=8000"]
# Install required Python packages from requirements.txt
# Add fpdf to the requirements.txt or directly here
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install fpdf

# Ensure Streamlit is installed
RUN pip install streamlit

# Expose the port Streamlit runs on
EXPOSE 8000
