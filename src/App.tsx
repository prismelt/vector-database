import styles from "./app.module.css";
import useLoginContext from "./context/login";
import Auth from "./auth";
import renderTitle from "./util/title";
import { useState } from "react";
import renderGetForm from "./util/get";
import renderPostForm from "./util/post";

function App() {
  const { user } = useLoginContext();

  if (!user) {
    return <Auth />;
  }

  const username = user.name;
  const userGroup = user.group;
  const isAdmin = user.is_admin;

  const [buttonUsed, setButtonUsed] = useState<0 | 1 | null>(null);

  const postForm = renderPostForm({ group_id: userGroup, is_admin: isAdmin });
  const getForm = renderGetForm({ group_id: userGroup, is_admin: isAdmin });

  return (
    <div className={styles.container}>
      {renderTitle(username, userGroup, isAdmin)}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => setButtonUsed(0)}>
          Post
        </button>
        <button className={styles.button} onClick={() => setButtonUsed(1)}>
          Get
        </button>
      </div>
      <div style={{ display: buttonUsed === 0 ? "block" : "none" }}>
        {postForm}
      </div>
      <div style={{ display: buttonUsed === 1 ? "block" : "none" }}>
        {getForm}
      </div>
    </div>
  );
}

export default App;
