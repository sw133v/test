import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import useRecordingsList from "../../hooks/use-recordings-list";
import "./styles.css";
import axios from "axios";

export default function RecordingsList({ audio }) {
  const { recordings, deleteAudio } = useRecordingsList(audio);

  function a(s) {
    const audioFile = new File([s], `test.wav`, {
      type: "audio/wav",
      lastModified: Date.now(),
    });

    console.log(audioFile);
    // File {name: 'test.wav', lastModified: 1664875246214, lastModifiedDate: Tue Oct 04 2022 18:20:46 GMT+0900 (한국 표준시),
    //  webkitRelativePath: '', size: 63, …}

    const formData = new FormData();
    formData.append("voice", audioFile);

    const baseURL = "https://j7d209.p.ssafy.io/";
    const postApi = axios.create({
      baseURL,
      headers: {
        "Content-type": "multipart/form-data",
      },
    });

    try {
      const res = postApi.post("ai-api/studies/stt/", formData);
      console.log(res);

      if (res.data.status === "SUCCESS") {
        window.alert("등록이 완료되었습니다.");
      }
    } catch (e) {
      // 서버에서 받은 에러 메시지 출력
      console.log(e);
    }
  }

  return (
    <div className="recordings-container">
      {recordings.length > 0 ? (
        <>
          <h1>Your recordings</h1>
          <div className="recordings-list">
            {recordings.map((record) => (
              <div className="record" key={record.key}>
                <audio controls src={record.audio} />
                <div className="delete-button-container">
                  <button
                    className="delete-button"
                    title="Delete this audio"
                    onClick={() => a(record.audio)}
                    // onClick={() => deleteAudio(record.key)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-records">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            size="2x"
            color="#f2ea02"
          />
          <span>You don't have records</span>
        </div>
      )}
    </div>
  );
}
