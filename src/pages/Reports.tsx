import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import Report from "../components/ReportForm" 



const Reports = () => {

    const [showNewForm, setShowNewForm] = useState(false)


    useEffect( ()=> {
        document.title = "Reports - ClinicPal App";
    },[])



    return(
        <div className="flex flex-col min-h-screen bg-neutral-100">
            <NavBar/>

        <main className="flex-1 pt-10 px-4 md:px-8">
            <section className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6">
                <header className="flex items-center justify-between border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
                    <button
                    onClick={() => setShowNewForm(prev => !prev)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md shadow-sm"
                    >
                    {showNewForm ? "Close Form" :  "Log new report"}
                    </button>
                </header>

                {showNewForm && <Report/>}
                
            </section>
        </main>
        </div>
        
    )
}
export default Reports