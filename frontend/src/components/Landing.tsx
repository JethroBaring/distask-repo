const Landing = () => {
  return (
    <div className='h-screen flex flex-col justify-center items-center p-48 gap-5 bg-grid'>
      <h1 className='text-5xl font-bold text-center'>
        Forge Your Online Community with{' '}
        <a href='/' className='text-flutter-blue font-extrabold underline'>
          Distask!
        </a>
      </h1>
      <a href='/auth/register'>
        <button className='btn btn-primary border-none normal-case text-white text-lg w-32 shadow-xl bg-flutter-blue hover:bg-flutter-blue hover:shadow-2xl hover:shadow-flutter-blue shadow-flutter-blue/50'>
          Join Now!
        </button>
      </a>
    </div>
  );
};

export default Landing