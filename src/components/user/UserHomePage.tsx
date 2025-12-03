

const UserHomePage = () => {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(to bottom, #190473 0%, #03000D 100%)",
      }}
    >
  
<div
  className="w-full h-[90vh] bg-center bg-cover px-6 flex items-center"
  style={{
    backgroundImage:
      "url('https://bodometer-assets.s3.eu-north-1.amazonaws.com/Heroic%20images/bodometer_home_page_heroic.jpg')",
  }}
>
  <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
    
   
    <div>
      <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight max-w-2xl">
        TRANSFORM <br /> YOUR BODY WITH
      </h1>

      <div className="mt-2">
        <img
          src="/Bodometer Logo corrected 1.png"
          alt="bodometer logo"
          className="w-[220px] md:w-[300px]"
        />
      </div>

      <p className="text-white text-lg md:text-xl mt-4 max-w-xl">
        EXPERT COACHES, SMART TRACKING, <br />
        REAL RESULTS.
      </p>
    </div>


    <div className="flex flex-col items-end">
     
      <button className="bg-purple-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-600 transition">
        Get Start
      </button>
 
      <p className="text-white text-sm mt-2">Start With Free Plan</p>
    </div>
  </div>
</div>

   
      <div className="py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Why Choose Bodometer?</h2>
      </div>
    </div>
  );
};

export default UserHomePage
