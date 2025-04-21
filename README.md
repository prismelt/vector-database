# Vector Database With ChromaDB

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![ChromaDB](https://img.shields.io/badge/ChromaDB-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

This repository contains the code for a Vector Database implementation using ChromaDB. It demonstrates modern data storage and retrieval techniques, optimized for high-dimensional vector data and similarity searches.

## 🚀 Features

### 🌟 Core Functionality

- **Efficient Vector Storage:** Utilize ChromaDB's advanced indexing to store and retrieve high-dimensional vectors quickly.
- **Similarity Search:** Implement fast and accurate similarity searches using various distance metrics.
- **Dynamic Data Handling:** Support real-time updates and deletions of vector data without rebuilding the entire index.
- **Scalable Architecture:** Design for horizontal scalability to handle growing datasets and increased query loads.
- **Multi-Modal Data Support:** Store and query vectors from various data types, including text, images, and audio.

---

## 🛠️ Tech Stack

- **Language:** Python
- **Vector Database:** ChromaDB
- **Web Framework:** FastAPI
- **Frontend:** React
- **Build Tool:** Vite
- **Type Checking:** TypeScript
- **Package Management:** pip
- **License:** MIT

---

## 📂 File Structure

```
backend/
src/
README.md
LICENSE
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js
- pnpm
- pip

### Steps to Run

1. **Clone the repository:**

   ```
   git clone https://github.com/yourusername/vector-database-chromadb.git
   cd vector-database-chromadb
   ```

1. **Add the Files**
   Add relevant files to ensure a workable frontend and backend.

1. **Set up a virtual environment:**

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

1. **Install dependencies:**

   ```
   pip install -r requirements.txt
   ```

1. **Run the example script:**
   ```
   python src/example.py
   ```

## 📖 Usage

1. **Initialize the database:**

   ```python
   from src.database import VectorDatabase

   db = VectorDatabase()
   ```

2. **Add vectors:**

   ```python
   vectors = [[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]]
   ids = ["vec1", "vec2"]
   db.add_vectors(vectors, ids)
   ```

3. **Perform a similarity search:**
   ```python
   query_vector = [1.5, 2.5, 3.5]
   results = db.search(query_vector, k=5)
   ```

---

## 📚 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add a feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## 💻 Tech Highlights

- Efficient vector indexing and retrieval using ChromaDB's advanced algorithms.
- Optimized for high-dimensional data and large-scale datasets.
- Flexible query options including k-nearest neighbors and range searches.
- Integration with popular data science and machine learning libraries.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- ChromaDB team for their excellent vector database implementation.
- The open-source community for continuous inspiration and support.
