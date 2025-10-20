import React from "react";
import { User } from "lucide-react";

const InmateProfileCard = ({ inmate }) => {
    if (!inmate) return <div>No Student Data</div>;

    return (
        <div className="w-4xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4 border">
            <div className="flex flex-col items-center border-b pb-3 shadow-sm rounded-2xl">
                <span>
                    <User className="w-40 h-40" />
                </span>
                <h2 className="text-2xl font-semibold text-gray-800 pb-3 text-center">
                    {inmate.firstName} {inmate.lastName}
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 pt-8">
                <div className="text-xl">
                    <strong>Student Name:</strong> {inmate.student_name}
                </div>
                <div className="text-xl">
                    <strong>Father Name:</strong> {inmate.father_name}
                </div>
                <div className="text-xl">
                    <strong>Mother Name:</strong> {inmate.mother_name}
                </div>
                <div className="text-xl">
                    <strong>Registration Number:</strong> {inmate.registration_number}
                </div>

                <div className="text-xl">
                    <strong>Birth Place:</strong>{" "}
                    <span>{inmate.birth_place}</span>
                </div>
                <div className="text-xl">
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(inmate.date_of_birth).toLocaleDateString()}
                </div>
                <div className="text-xl">
                    <strong>Gender:</strong> {inmate.gender}
                </div>
                <div className="text-xl">
                    <strong>Balance:</strong> ₹{inmate.deposite_amount}
                </div>
                <div className="text-xl">
                    <strong>Nationality:</strong>{" "}
                    {inmate.nationality}
                </div>
                <div className="text-xl">
                    <strong>Religion:</strong> {inmate.religion}
                </div>
                <div className="text-xl">
                    <strong>Mother Tongue:</strong> {inmate.mother_tongue}
                </div>
                <div className="text-xl">
                    <strong>Status:</strong>{" "}
                    <span className="text-blue-600">{inmate.contact_number}</span>
                </div>
                {/* <div className="text-xl">
                    <strong>Created At:</strong>{" "}
                    {new Date(inmate.createdAt).toLocaleString()}
                </div>
                <div className="text-xl">
                    <strong>Updated At:</strong>{" "}
                    {new Date(inmate.updatedAt).toLocaleString()}
                </div> */}
            </div>
        </div>
    );
};

export default InmateProfileCard;
