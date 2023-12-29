"use client";

import { useParams } from "next/navigation";
import React from "react";

const Profile = () => {
	const params = useParams();
	return <div className="text-center text-lg">Profile {params.id}</div>;
};

export default Profile;
