import subprocess

def run_flask():
    subprocess.run(["python", "main.py"])

def run_streamlit():
    subprocess.run(["streamlit", "run", "streamlit_app.py"])

if __name__ == "__main__":
    from multiprocessing import Process

    flask_process = Process(target=run_flask)
    streamlit_process = Process(target=run_streamlit)

    flask_process.start()
    streamlit_process.start()

    flask_process.join()
    streamlit_process.join()
