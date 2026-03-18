import os
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.oauth2.service_account import Credentials
import io

SCOPES = ["https://www.googleapis.com/auth/drive"]

DOWNLOAD_FOLDER = "resumes"

# create folder if not exists
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


def download_file(file_id):

    creds = Credentials.from_service_account_file(
        "credentials.json",
        scopes=SCOPES
    )

    service = build("drive", "v3", credentials=creds)

    file = service.files().get(fileId=file_id, fields="name").execute()

    filename = file["name"]

    # full path
    filepath = os.path.join(DOWNLOAD_FOLDER, filename)

    request = service.files().get_media(fileId=file_id)

    fh = io.FileIO(filepath, "wb")
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()

    fh.close()

    return filepath