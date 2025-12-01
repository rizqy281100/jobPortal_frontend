"use server";

import { api } from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";

export async function createJobPost(formData: FormData) {
  try {
    const accessToken = formData.get("accessToken")?.toString();
    console.log("Access Token:", accessToken);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: `${formData.get("city")}, ${formData.get("country")}`,
      employment_type_id: Number(formData.get("employment_type_id")),
      experience_level_id: Number(formData.get("experience_level_id")),
      salary_type_id: Number(formData.get("salary_type_id") || 1),
      salary_min: Number(formData.get("minSalary")),
      salary_max: Number(formData.get("maxSalary")),
      currency_id: formData.get("currency"),
      deadline: formData.get("deadline"),
      tags: JSON.parse(String(formData.get("tags") || "[]")),
      job_post_status_id: 1, // Default to 'Draft'
      recruiter_id: formData.get("recruiter_id"),
    };

    console.log("Submitting Payload:", payload);

    const res = await api.post("/job-posts", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        withCredentials: true,
      },
    });
    if (res?.code === 200) {
      redirect("/dashboard-recruiters?tab=overview");
    }
    // return {
    //   success: true,
    //   data: res.data,
    // };
  } catch (err: any) {
    console.error("Job post error:", err?.response?.data || err);
    return {
      success: false,
      error: err?.response?.data || "Something went wrong.",
    };
  }
}

export async function updateJobPostStatus(
  id: string,
  status: string,
  accessToken: string
) {
  try {
    if (!accessToken) return;
    // const accessToken = formData.get("accessToken")?.toString();
    // const { user, accessToken } = useAppSelector((state) => state.auth);
    // console.log("Access Token:", accessToken);
    const payload = {
      status_id: status,
    };

    console.log("Submitting Payload:", payload);

    const res = await api.post(`/job-posts/status/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        withCredentials: true,
      },
    });
    console.log(res);
    // if (res?.code === 200) {
    //   redirect("/dashboard-recruiters?tab=overview");
    // }
    return {
      success: true,
      data: res?.data,
    };
  } catch (err: any) {
    console.error("Job post error:", err?.response?.data || err);
    return {
      success: false,
      error: err?.response?.data || "Something went wrong.",
    };
  }
}
