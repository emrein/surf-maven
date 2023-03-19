import React, { useRef, useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard(props) {

    const activityRowsRef = useRef(null);
    const top10RowsRef = useRef(null);

    function testInputData() {
        {
            console.log('Runnig test...');
            let nData = props.data;
            console.log('   data='+JSON.stringify(props));
            callTableFill()
        }
    }

    function callTableFill() {
        console.log('   callTableFill');
        // Find the table body element and inject the HTML
        if (activityRowsRef.current) {
            let rowHTML = "";
            for (let i = 0; i < 10 + 1; i++) {
                rowHTML += "<tr><td>Row " + JSON.stringify(props) + ", Column 1</td><td>Row " + i.toString() + ", Column 2</td></tr>";
            }
            activityRowsRef.current.innerHTML = rowHTML;
        }
        if (top10RowsRef.current) {
            let rowHTML = "";
            for (let i = 0; i < 10 + 1; i++) {
                rowHTML += "<tr><td>Row " + JSON.stringify(props) + ", Column 1</td><td>Row " + i.toString() + ", Column 2</td></tr>";
            }
            top10RowsRef.current.innerHTML = rowHTML;
        }
    }
    useEffect(() => {

        callTableFill();
    }, []);

    const getActivityTablePart = () => {

        return (
            <div>
                <div className="block w-full overflow-x-auto pastel-green" >
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                    Definiton Name
                                </th>
                                <th className="px-4 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                    URL
                                </th>
                                <th className="px-4 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                    Extension Runs
                                </th>
                                <th className="px-4 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                    Catched Behavior Count
                                </th>
                            </tr>
                        </thead>
                        <tbody ref={activityRowsRef}>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                    /argon/
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    4,569
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    340
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    <i className="fas fa-arrow-up text-green-500 mr-4"></i>
                                    46,53%
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                    /argon/index.html
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    3,985
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    319
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    <i className="fas fa-arrow-down text-orange-500 mr-4"></i>
                                    46,53%
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                    /argon/charts.html
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    3,513
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    294
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    <i className="fas fa-arrow-down text-orange-500 mr-4"></i>
                                    36,49%
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                    /argon/tables.html
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    2,050
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    147
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    <i className="fas fa-arrow-up text-green-500 mr-4"></i>
                                    50,87%
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                    /argon/profile.html
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    1,795
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    190
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                    <i className="fas fa-arrow-down text-red-500 mr-4"></i>
                                    46,53%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const getTop10TablePart = () => {

        return (
            <div className="block w-full overflow-x-auto pastel-blue" >
                {/* Projects table */}
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead className="thead-light">
                        <tr>
                            <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                Referral
                            </th>
                            <th className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left">
                                Visitors
                            </th>
                            <th
                                className="px-6 bg-gray-100 text-gray-600 align-middle border border-solid border-gray-200 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-no-wrap font-semibold text-left"
                                style={{ minWidth: "140px" }}
                            ></th>
                        </tr>
                    </thead>
                    <tbody ref={top10RowsRef}>
                        <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                Facebook
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                1,480
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">60%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                            <div
                                                style={{ width: "60%" }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                Facebook
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                5,480
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">70%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                                            <div
                                                style={{ width: "70%" }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                Google
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                4,807
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">80%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                                            <div
                                                style={{ width: "80%" }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                Instagram
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                3,678
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">75%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                            <div
                                                style={{ width: "75%" }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4 text-left">
                                twitter
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                2,645
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-no-wrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">30%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-orange-200">
                                            <div
                                                style={{ width: "30%" }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="relative md:ml-64 bg-gray-200">
            {testInputData()}
            {/* Header */}
            <div className="px-4 md:px-10 mx-auto w-full -m-24">
                <div className="flex flex-wrap mt-4">
                    <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                            <div className="rounded-t mb-0 px-4 py-3 border-0 grid-title">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                        <h4 className="font-semibold text-base text-gray-800">
                                            Page activities
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            {getActivityTablePart()}
                        </div>
                    </div>
                    <div className="w-full xl:w-4/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                            <div className="rounded-t mb-0 px-4 py-3 border-0 grid-title">
                                <div className="flex flex-wrap items-center">
                                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                        <h4 className="font-semibold text-base text-gray-800">
                                            Top 10 behaviors found
                                        </h4>
                                    </div>
                                </div>
                            </div>
                            {getTop10TablePart()}
                        </div>
                    </div>
                </div>
                <footer className="block py-4">
                    <div className="container mx-auto px-4">
                        <hr className="mb-4 border-b-1 border-gray-300" />
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Dashboard;
