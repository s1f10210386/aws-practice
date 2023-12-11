import type { NextPage } from "next";
import Link from "next/link";

const uploadFile = async (file: File) => {
  console.log("呼べてる");
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    console.log("aaa");

    if (response.ok) {
      console.log("ファイルがアップロードされました");
      const data = await response.json();
      console.log(data.message);
    } else {
      console.error("ファイルのアップロードに失敗しました");
    }
  } catch (error) {
    console.error("エラーが発生しました", error);
  }
};

const Home: NextPage = () => {
  return (
    <>
      <Link href="/protected">
        <button>Go to Protected Page</button>
      </Link>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            uploadFile(e.target.files[0]);
          }
        }}
      />
    </>
  );
};

export default Home;
