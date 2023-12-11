import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Link href="/protected">
        <button>Go to Protected Page</button>
      </Link>
    </>
  );
};

export default Home;
