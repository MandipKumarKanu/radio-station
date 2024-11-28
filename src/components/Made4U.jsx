import React from "react";
import Made4UCard from "./Made4UCard";

const radioList = [
  {
    id: "Y_OOEauq-U3AB9GcRyuee",
    name: "Ujyaalo Radio Network",
    streamUrl: "https://stream-151.zeno.fm/h527zwd11uquv",
    frequency: 90.0,
    address:
      "Ujyaalo Ghar (Behind Central Zoo), Lalitpur - 4, Shanti Chowk, Jawalakhel",
    province: 3,
  },
  {
    id: "PpdCGSEQ44Ox4uLzlgcin",
    name: "Radio Kantipur",
    streamUrl: "https://radio-broadcast.ekantipur.com/stream",
    frequency: 96.1,
    address: "Subidhanagar, Tinkune, Kathmandu, Nepal",
    province: 3,
  },
  {
    id: "63DAluhRgl-PcYeixk5eY",
    name: "Radio Nepal",
    streamUrl: "https://stream1.radionepal.gov.np/live",
    frequency: 100.0,
    address: "Kathmandu, Nepal",
    province: 3,
  },
];

const Made4U = () => (
  <div className="mb-12">
    <p className="text-2xl opacity-70">Made For You</p>
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {radioList.length > 0 ? (
        radioList.map((radio) => (
          <Made4UCard
            key={radio.id}
            name={radio.name}
            frequency={radio.frequency}
            imgId={radio.id}
          />
        ))
      ) : (
        <p>No radio stations available.</p>
      )}
    </div>
  </div>
);

export default Made4U;
