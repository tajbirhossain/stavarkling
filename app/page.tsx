'use client'

import Header from "@/components/Header";
import Link from "next/link";
import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(".hero-reveal", {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    });

    gsap.set(".hero-image-reveal", {
      opacity: 0,
      scale: 0.92,
      y: 30,
      filter: "blur(12px)",
    });

    const heroTl = gsap.timeline({
      defaults: {
        ease: "expo.out",
      },
      onComplete: () => {
        sessionStorage.setItem("homeAnimationPlayed", "true");
      },
    });

    heroTl.to(".hero-reveal", {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.3,
      stagger: {
        each: 0.12,
      },
      clearProps: "all",
    });

    heroTl.to(
      ".hero-image-reveal",
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.8,
        ease: "power3.out",
        clearProps: "all",
      },
      "-=1.0"
    );

    gsap.from(".grid-reveal-item", {
      scrollTrigger: {
        trigger: ".grid-reveal-container",
        start: "top 82%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 35,
      scale: 0.97,
      filter: "blur(8px)",
      duration: 1.2,
      stagger: {
        each: 0.1,
      },
      ease: "power3.out",
      clearProps: "all",
    });

    gsap.from(".card-reveal-item", {
      scrollTrigger: {
        trigger: ".card-reveal-container",
        start: "top 82%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      scale: 0.96,
      filter: "blur(10px)",
      duration: 1.35,
      stagger: {
        each: 0.12,
      },
      ease: "power3.out",
      clearProps: "all",
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="relative overflow-hidden bg-[url('/images/hero-bg.png')] bg-cover bg-[position:center_top] max-[639px]:bg-[position:72%_center]">
        <Header ind={-1} />

        <section className="relative pt-22 pb-60 max-[1023px]:pt-18 max-[1023px]:pb-36 max-[639px]:pt-14 max-[639px]:pb-24">
          <div className="containerMain ml-auto flex flex-row items-center justify-between gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
            <div className="w-1/3 text-left max-[1023px]:w-full max-[1023px]:text-center">
              <h4 className="hero-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                THE WORLD CAN SEE IT. YOU CAN OWN IT.
              </h4>
              <h1 className="hero-reveal relative mb-13 text-7xl leading-none font-semibold max-[767px]:text-6xl max-[639px]:mb-10 max-[639px]:text-[2.625rem] max-[639px]:leading-[1.1] before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[''] max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2">
                Universe.{" "}
                <span className="block text-brand italic">Decided.</span>
              </h1>
              <h2 className="hero-reveal fontCinzel mb-3 text-[32px] font-medium text-brand max-[639px]:text-[1.625rem]">
                &euro; 1,000,000
              </h2>
              <p className="hero-reveal mb-5 text-[22px] font-semibold max-[639px]:text-lg">
                One unknown artist.{" "}
                <br/>
                One artwork.
                <br/>
                One collector.
              </p>
              <div className="hero-reveal flex justify-start max-[1023px]:justify-center">
                <Link
                  href="/access-application"
                  className="btnGradient mb-5 inline-flex items-center justify-center gap-x-7 px-5 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:text-base max-[639px]:hover:gap-x-7"
                >
                  REQUEST ACCESS
                  <img
                    src="/images/icons/arrow-right.png"
                    alt=""
                    className="w-5 brightness-[100]"
                  />
                </Link>
              </div>
              <div className="hero-reveal flex justify-start max-[1023px]:justify-center">
                <Link
                  href="/what-is-this"
                  className="flex w-fit cursor-pointer items-center gap-x-3 text-xl font-semibold duration-300 hover:gap-x-5 max-[639px]:text-lg"
                >
                  What is this?
                  <img src="/images/icons/arrow-right.png" alt="" className="w-5" />
                </Link>
              </div>
            </div>

            <div className="flex w-2/3 justify-center max-[1023px]:w-full">
              <div className="translate-x-[8%] max-[1549px]:translate-x-[4%] max-[1249px]:translate-x-[2%] max-[1023px]:translate-x-0">
                <img
                  src="/images/artwork.png"
                  alt=""
                  className="hero-image-reveal h-140 w-auto max-w-none object-contain shadow-[30px_30px_52px_5px_#3c3c3c5e] max-[1549px]:h-115 max-[1249px]:h-95 max-[1023px]:h-auto max-[1023px]:w-full max-[1023px]:max-w-[420px] max-[1023px]:shadow-[24px_24px_44px_4px_#3c3c3c5e] max-[639px]:max-w-[320px] max-[639px]:shadow-[18px_18px_36px_4px_#3c3c3c5e]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="grid-reveal-container bg-[#f7f3f4] py-12 max-[639px]:py-10">
        <div className="containerMain grid grid-cols-4 gap-x-0 gap-y-0 max-[1023px]:grid-cols-2 max-[1023px]:gap-x-8 max-[1023px]:gap-y-12 max-[639px]:grid-cols-1 max-[639px]:gap-y-10">
          <div className="grid-reveal-item relative flex flex-col items-center after:absolute after:top-1/2 after:right-0 after:block after:h-32 after:w-0.5 after:-translate-y-1/2 after:bg-gray-200 after:content-[''] max-[1023px]:after:hidden">
            <h3 className="fontCinzel mb-1.5 text-center text-xl font-medium text-brand">
              01.
            </h3>
            <h2 className="mb-3 text-center text-lg font-semibold max-[639px]:text-base">
              PUBLIC WEBSITE
            </h2>
            <p className="max-w-[270px] text-center text-lg font-semibold max-[639px]:text-base">
              You can view the artwork and key details.
            </p>
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-2.5 z-10 block w-5 -translate-y-1/2 bg-[#f7f3f4] py-2 max-[1023px]:hidden"
            />
          </div>

          <div className="grid-reveal-item relative flex flex-col items-center after:absolute after:top-1/2 after:right-0 after:block after:h-32 after:w-0.5 after:-translate-y-1/2 after:bg-gray-200 after:content-[''] max-[1023px]:after:hidden">
            <h3 className="fontCinzel mb-1.5 text-center text-xl font-medium text-brand">
              02.
            </h3>
            <h2 className="mb-3 text-center text-lg font-semibold max-[639px]:text-base">
              VIP ACCESS APPLICATION
            </h2>
            <p className="max-w-[270px] text-center text-lg font-semibold max-[639px]:text-base">
              Submit your application. Not every request will be accepted.
            </p>
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-2.5 z-10 block w-5 -translate-y-1/2 bg-[#f7f3f4] py-2 max-[1023px]:hidden"
            />
          </div>

          <div className="grid-reveal-item relative flex flex-col items-center after:absolute after:top-1/2 after:right-0 after:block after:h-32 after:w-0.5 after:-translate-y-1/2 after:bg-gray-200 after:content-[''] max-[1023px]:after:hidden">
            <h3 className="fontCinzel mb-1.5 text-center text-xl font-medium text-brand">
              03.
            </h3>
            <h2 className="mb-3 text-center text-lg font-semibold max-[639px]:text-base">
              NOT MEANT FOR EVERYONE
            </h2>
            <p className="max-w-[270px] text-center text-3xl font-semibold text-brand italic max-[639px]:text-2xl">
              One person will understand.
            </p>
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-2.5 z-10 block w-5 -translate-y-1/2 bg-[#f7f3f4] py-2 max-[1023px]:hidden"
            />
          </div>

          <div className="grid-reveal-item relative flex flex-col items-center">
            <h3 className="fontCinzel mb-1.5 text-center text-xl font-medium text-brand">
              04.
            </h3>
            <h2 className="mb-3 text-center text-lg font-semibold text-brand max-[639px]:text-base">
              FINAL DECISION
            </h2>
            <p className="max-w-[300px] text-center text-lg font-semibold max-[639px]:text-base">
              You may be invited to the final decision.{" "}
              <br />
              One artwork. One Buyer.{" "}
              <br className="block max-[639px]:hidden" />
              <span className="text-brand">One million.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="card-reveal-container py-12 max-[639px]:py-10">
        <div className="containerMain grid grid-cols-[1.35fr_1fr_1fr_1fr] gap-6 gap-x-10 max-[1279px]:grid-cols-2 max-[1279px]:gap-x-6 max-[767px]:grid-cols-1">
          <div className="card-reveal-item relative flex flex-col justify-between rounded-2xl bg-[#f7f3f4] px-7 py-6 max-[639px]:px-5">
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-8 block w-5 -translate-y-1/2 max-[1279px]:hidden"
            />
            <div>
              <div className="mb-5 flex items-center justify-between gap-x-3">
                <img
                  src="/images/icons/lotus-icon-colored.png"
                  alt=""
                  className="w-12 shrink-0 max-[639px]:w-10"
                />
                <h3 className="text-center text-sm font-bold max-[639px]:text-xs">
                  <span className="fontCinzel text-brand">01. </span>
                  PUBLIC WEBSITE
                </h3>
                <img
                  src="/images/icons/eye-icon.png"
                  alt=""
                  className="w-6 shrink-0 max-[639px]:w-5"
                />
              </div>
              <div className="mb-4 flex h-fit flex-row gap-y-0 max-2xl:flex-col max-2xl:gap-y-5 max-[1279px]:flex-row max-[1279px]:gap-y-0 max-[767px]:flex-col max-[767px]:gap-y-5">
                <div className="w-1/2 max-2xl:w-full max-[1279px]:w-1/2 max-[767px]:w-full">
                  <h2 className="relative mb-6 text-center text-3xl font-bold max-[639px]:text-2xl before:absolute before:bottom-[-0.75rem] before:left-1/2 before:h-0.5 before:w-8 before:-translate-x-1/2 before:bg-brand before:content-['']">
                    A Universe,
                    <br />
                    <span className="text-brand italic">Decided</span>
                  </h2>
                  <h3 className="fontCinzel mb-3 text-center text-lg font-semibold text-brand max-[639px]:text-base">
                    &euro;1,000,000
                  </h3>
                  <p className="text-center font-semibold">
                    This is not a public sale. Access is limited
                  </p>
                </div>
                <div className="flex h-auto w-1/2 items-center justify-center max-2xl:w-full max-[1279px]:w-1/2 max-[767px]:w-full">
                  <img
                    src="/images/artwork.png"
                    alt=""
                    className="block w-2/3 shadow-[2px_2px_8px_2px_#cccccc] max-2xl:w-1/2 max-[1279px]:w-2/3 max-[639px]:w-1/2"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-4 max-[1399px]:w-full max-[1399px]:flex-col-reverse max-[1399px]:items-center max-[1399px]:gap-3">
              <Link
                href="/access-application"
                className="btnGradient inline-flex shrink-0 items-center justify-center gap-x-4 whitespace-nowrap px-6 py-2.5 text-base duration-300 hover:gap-x-6"
              >
                REQUEST ACCESS
                <img
                  src="/images/icons/arrow-right.png"
                  alt=""
                  className="w-4 brightness-[100]"
                />
              </Link>
              <Link
                href="/what-is-this"
                className="flex shrink-0 items-center gap-x-3 whitespace-nowrap text-lg font-semibold duration-300 hover:gap-x-5"
              >
                What is this?
                <img src="/images/icons/arrow-right.png" alt="" className="w-4" />
              </Link>
            </div>
          </div>

          <div className="card-reveal-item relative flex flex-col justify-between rounded-2xl bg-[#f7f3f4] px-7 py-6 max-[639px]:px-5">
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-8 block w-5 -translate-y-1/2 max-[1279px]:hidden"
            />
            <div>
              <div className="mb-5 flex items-center justify-between gap-x-3">
                <img
                  src="/images/icons/lotus-icon-colored.png"
                  alt=""
                  className="w-12 shrink-0 max-[639px]:w-10"
                />
                <h3 className="text-center text-sm font-bold max-[639px]:text-xs">
                  <span className="fontCinzel text-brand">02. </span>
                  VIP ACCESS APPLICATION
                </h3>
                <img
                  src="/images/icons/lock.png"
                  alt=""
                  className="w-4 shrink-0"
                />
              </div>
              <div className="mb-4 max-w-40 max-[767px]:mx-auto max-[767px]:max-w-none max-[767px]:text-center max-[639px]:max-w-none">
                <p className="relative mb-6 text-xl font-bold max-[767px]:before:left-1/2 max-[767px]:before:-translate-x-1/2 max-[639px]:text-lg before:absolute before:bottom-[-0.75rem] before:left-0 before:h-0.5 before:w-6 before:bg-brand before:content-['']">
                  Access is limited.{" "}
                  <br />
                  Not every request will be accepted
                </p>
                <p className="font-semibold">
                  To request access, please answer few questions.
                </p>
              </div>
            </div>
            <Link
              href="/access"
              className="btnGradient flex w-full items-center justify-center gap-x-4 px-6 py-2.5 duration-300 hover:gap-x-6"
            >
              REQUEST ACCESS
              <img
                src="/images/icons/arrow-right.png"
                alt=""
                className="w-4 brightness-[100]"
              />
            </Link>
          </div>

          <div className="card-reveal-item relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#f7f3f4] px-7 py-6 max-[639px]:px-5">
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="absolute top-1/2 -right-8 z-10 block w-5 -translate-y-1/2 max-[1279px]:hidden"
            />
            <img
              src="/images/icons/shining-star.png"
              alt=""
              className="pointer-events-none absolute right-4 bottom-5 w-16 opacity-40 max-[639px]:w-12"
            />
            <div className="max-[767px]:text-center">
              <div className="mb-5 flex items-center justify-between gap-x-3">
                <img
                  src="/images/icons/lotus-icon-colored.png"
                  alt=""
                  className="w-12 shrink-0 max-[639px]:w-10"
                />
                <h3 className="text-center text-sm font-bold max-[639px]:text-xs">
                  <span className="fontCinzel text-brand">03. </span>
                  NOT MEANT FOR EVERYONE
                </h3>
                <img
                  src="/images/icons/lock.png"
                  alt=""
                  className="w-4 shrink-0"
                />
              </div>
              <p className="mb-4 text-sm font-bold tracking-wide text-brand">
                SELECTION, NOT SCALE
              </p>
              <p className="relative mb-6 text-[28px] leading-snug font-semibold text-brand italic max-[767px]:before:left-1/2 max-[767px]:before:-translate-x-1/2 max-[639px]:text-[1.5rem] before:absolute before:bottom-[-0.75rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-['']">
                One person will understand.
              </p>
              <p className="max-w-[200px] font-semibold text-brand/80 max-[767px]:mx-auto">
                This is not designed for a crowd. It is designed for recognition.
              </p>
            </div>
            <p className="relative z-10 text-sm font-bold tracking-wide text-brand/70 max-[767px]:text-center">
              INTENTIONAL · SELECTIVE
            </p>
          </div>

          <div className="card-reveal-item relative rounded-2xl bg-[#f7f3f4] px-7 py-6 max-[639px]:px-5">
            <div className="mb-10 flex items-center justify-between gap-x-3 max-[639px]:mb-8">
              <img
                src="/images/icons/lotus-icon-colored.png"
                alt=""
                className="w-12 shrink-0 max-[639px]:w-10"
              />
              <h3 className="text-center text-sm font-bold max-[639px]:text-xs">
                <span className="fontCinzel text-brand">04. </span>
                FINAL DECISION
              </h3>
              <img
                src="/images/icons/lock.png"
                alt=""
                className="w-4 shrink-0"
              />
            </div>
            <div className="flex items-center max-[767px]:flex-col max-[767px]:gap-y-5">
              <div className="w-[52%] pr-4 max-[767px]:w-full max-[767px]:pr-0 max-[767px]:text-center">
                <p className="mb-6 text-lg font-semibold max-[639px]:text-base">
                  You may be invited to the final decision.
                </p>
                <p className="text-lg font-semibold max-[639px]:text-base">
                  One artwork. <br />
                  One buyer. <br />
                  <span className="text-brand">One million</span>
                </p>
              </div>
              <div className="flex w-[48%] items-center justify-center max-[767px]:w-full">
                <img
                  src="/images/artwork.png"
                  alt=""
                  className="w-full max-w-[180px] shadow-[2px_2px_8px_2px_#cccccc] max-[639px]:max-w-[150px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
