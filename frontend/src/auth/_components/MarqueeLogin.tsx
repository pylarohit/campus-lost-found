"use client";
import { cn } from "../../lib/utils";
import { Marquee } from "../../components/magicui/marquee";

const reviews = [
  {
    name: "Arjun",
    username: "@arjun_k",
    body: "Lost my wallet in the library and someone reported it within an hour. Got it back the same day!",
    img: "/a1.png",
  },
  {
    name: "Priya",
    username: "@priya_m",
    body: "Found a laptop left behind in the cafeteria. Posted it here and the owner claimed it in minutes!",
    img: "/a2.png",
  },
  {
    name: "Rahul",
    username: "@rahul_s",
    body: "My ID card went missing before exams. CampusTrack helped me locate it at the admin office. Lifesaver!",
    img: "/a6.png",
  },
  {
    name: "Sneha",
    username: "@sneha_r",
    body: "I lost my keys near the sports ground. Got a notification that someone found them within 30 mins!",
    img: "/a3.png",
  },
  {
    name: "Vikram",
    username: "@vikram_d",
    body: "Left my charger in the lecture hall. The AI-powered matching feature connected me with the finder instantly.",
    img: "/a4.png",
  },
  {
    name: "Ananya",
    username: "@ananya_p",
    body: "Someone found my headphones and posted them here. The location tracking made pickup so easy!",
    img: "/a5.png",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-60 cursor-pointer overflow-hidden rounded-xl border px-3 py-2",
        // light styles
        "bg-gradient-to-br from-gray-100/50 via-white/60 to-blue-200 border border-white",
      )}
    >
      <div className="flex flex-row items-center gap-2 ">
        <img className="rounded-full" width="30" height="30" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium font-inter">
            {name}
          </figcaption>
          <p className="text-xs font-medium font-inter">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm tracking-tight leading-tight font-raleway">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    </div>
  );
}