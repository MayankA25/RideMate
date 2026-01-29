import React, { useEffect } from "react";
import Header from "../Header/Header";
import ReportItem from "../ReportItem/ReportItem";
import ReportItemSkeleton from "../ReportItemSkeleton/ReportItemSkeleton";
import { useParams } from "react-router-dom";
import useReportStore from "../../store/useReportStore";

export default function Reports() {
  const params = useParams();

  const { getReports, loading, reports } = useReportStore();

  useEffect(()=>{
    console.log("Params: ", params.id);
    getReports(params.id);
  }, [])
  return (
    <div className="w-[78%] m-auto h-full">
      <div className="flex flex-col py-10 gap-3">
        <Header headerTitle={"User Reports"} />
        <hr className="text-white/15" />
        <div className="flex flex-col py-5 gap-5">
            <h1 className="text-xl font-bold">Reports ({reports.length})</h1>
            <div className="flex flex-col gap-2">
              { loading ? [...Array(10)].map((_, index)=>{
                return (
                  <ReportItemSkeleton key={index}/>
                )
              }) : reports.map((report, index)=>{
                return (
                  <ReportItem key={index} report={report}/>
                )
              }) }
            </div>
        </div>
      </div>
    </div>
  );
}
