import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

    api.post('transactions/import', data).then(response => {

    }).catch(error => {
      console.log(error)
    });
  }

  function submitFile(files: File[]): void {
    setUploadedFiles(
      files.map(file => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
      })),
    );
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Import Transactions</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Only CSV files
            </p>
            <button onClick={handleUpload} type="button">
              Send
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
