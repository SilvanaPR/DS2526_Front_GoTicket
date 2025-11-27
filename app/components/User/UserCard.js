"use client";
import React from "react";

export default function UserCard({ user }) {
    if (!user) return null;
    const {
        userName,
        userLastName,
        userEmail,
        userPhoneNumber,
        userDirection,
        userType,
    } = user;

    return (
        <div className="w-full rounded-lg border bg-white shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {userName} {userLastName}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {userType}
                    </span>
                </div>
                <div className="flex-1 flex flex-wrap gap-x-10 gap-y-2 text-xs text-gray-700">
                    <p><span className="font-medium">Email:</span> {userEmail}</p>
                    <p><span className="font-medium">Teléfono:</span> {userPhoneNumber}</p>
                    <p><span className="font-medium">Dirección:</span> {userDirection}</p>
                </div>
            </div>
        </div>
    );
}