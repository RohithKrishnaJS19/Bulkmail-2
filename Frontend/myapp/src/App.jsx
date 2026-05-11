import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
    const [status, setstatus] = useState(false)
    const [input, setinput] = useState()
    function handleinput(event) {
        setinput(event.target.value)
    }
    function handlesend() {
        
        setstatus(true)
        axios.post("https://bulkmail-2-wpvg.onrender.com/sendemail", { value: input,email:email }).then(function (data) {
            if (data.data == true) {
                alert("Gmail Sended Successfully")
                setstatus(false)
                setinput("")
            }
            else {
                setstatus(false)
                alert("Gmail Failed")
            }
        }).catch(function () {
            alert("Please choose the file")
            setstatus(false)
        })
        
    }
    const [count,setcount] = useState(0)
    const [email,setemail] = useState([])
    function handlefile(event) {
        
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onload = function (event) {
            const result = event.target.result
            const data = XLSX.read(result, { type: "binary" })
            const sheetname = data.SheetNames[0]
            const sheet = data.Sheets[sheetname]
            const emaillist = XLSX.utils.sheet_to_json(sheet, { header: "A" })
            const emails = emaillist.map(function (item) {
                return item.A;
            })
            setemail(emails)
            setcount(emails.length)
        }
        reader.readAsBinaryString(file)
        
    }
    return (
        <div>
            <div className="bg-blue-900 p-2 text-center">
                <h1 className="text-white text-3xl font-bold">Bulk Mail</h1>
            </div>
            <div className="bg-blue-800 p-4 text-center">
                <p className="text-white font-bold">We can help your business with sending multiple emails at once</p>
            </div>
            <div className="bg-blue-700 p-4 text-center">
                <p className="text-white font-bold">Drag and Drop</p>
            </div>
            <div className="bg-blue-400 flex flex-col items-center gap-7 pb-10">
                <div className="w-[80%] m-10">
                    <textarea value={input} onChange={handleinput} placeholder="Enter the Email text..." className="p-2 bg-white w-[100%] h-50 text-xl rounded"></textarea>
                </div>
                <div className="border-dashed border-4 border-white p-4">
                    <input type="file" onChange={handlefile}></input>
                </div>
                <div>
                    <p>Total Email in the file: {count}</p>
                </div>
                <div>
                    <button className="bg-black text-white font-bold p-3 rounded" onClick={handlesend}>{status ? "Sending" : "Send"}</button>
                </div>
            </div>
        </div>
    )
}
export default App;
