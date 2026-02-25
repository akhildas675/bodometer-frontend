import SidebarLayout from "@/components/ui/app.sidebar/sidebar.layout";

const TrainerDashboard = () => {

 

 
  return (

    <SidebarLayout role={"trainer"}>

    <div className="min-h-screen bg-[#050017] flex">
      {/* SIDEBAR */}
     

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 text-white">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Trainer Dashboard</h1>
          
        </div>

       
       
        {/* RECENT ACTIVITY */}
        
      </main>
    </div>
    </SidebarLayout>
  );
};

export default TrainerDashboard;
