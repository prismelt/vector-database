import styles from "../app.module.css";

function renderTitle(username: string, userGroup: number, isAdmin: boolean) {
  return (
    <div className={styles.titleContainer}>
      <h1 className={styles.title}>Vector Database Management Frontend</h1>
      <p className={styles.description}>User Information</p>
      <div className={styles.userContainer}>
        <p className={styles.userItem}>Username: {username}</p>
        <p className={styles.userItem}>User Group: {userGroup}</p>
        {isAdmin ? (
          <p className={styles.userItem}>Status: Admin</p>
        ) : (
          <p className={styles.userItem}>Status: Employee</p>
        )}
      </div>
    </div>
  );
}

export default renderTitle;
