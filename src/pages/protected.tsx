import { useSession, signIn, signOut } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();
  const currentID = () => {
    console.log(session);
  };
  if (status === "loading") {
    return null;
  }

  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <div>userId:{session.userId}</div>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default Home;
