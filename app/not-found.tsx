"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingPills, setFloatingPills] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      rotation: number;
      scale: number;
      speed: number;
    }>
  >([]);
  const [scanHeight, setScanHeight] = useState(0);
  const [pulseSize, setPulseSize] = useState(1);
  const [timestamp, setTimestamp] = useState<string>("");

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize floating pills
  useEffect(() => {
    const pills = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.5 + Math.random() * 1.5,
    }));
    setFloatingPills(pills);
  }, []);

  // Animate floating pills
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingPills((pills) =>
        pills.map((pill) => ({
          ...pill,
          rotation: pill.rotation + 1,
          y: pill.y <= -50 ? window.innerHeight + 50 : pill.y - pill.speed,
        }))
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Scanning animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanHeight((h) => (h >= 100 ? 0 : h + 0.5));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseSize((size) => (size === 1 ? 1.1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update timestamp after mount
  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Background medical symbols */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0h10v60H25zM0 25h60v10H0z' fill='%230288d1' fill-opacity='0.1'/%3E%3C/svg%3E')",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating pills */}
      {floatingPills.map((pill) => (
        <div
          key={pill.id}
          className="absolute"
          style={{
            left: `${pill.x}px`,
            top: `${pill.y}px`,
            transform: `rotate(${pill.rotation}deg) scale(${pill.scale})`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="w-8 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-30" />
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* 404 with medical cross */}
        <div className="relative inline-block">
          <h1
            className="text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 leading-none"
            style={{
              transform: `scale(${pulseSize})`,
              transition: "transform 0.5s ease-out",
            }}
          >
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <Image
              src="/images/404-illustration.svg"
              alt="Medical Cross"
              width={400}
              height={400}
              className="opacity-50"
              priority
            />
          </div>
        </div>

        {/* Subtitle with scan effect */}
        <div className="relative mb-12">
          <h2 className="text-4xl font-semibold text-blue-800 mb-4">
            Page Not Found
          </h2>
          <div
            className="h-1 w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent absolute bottom-0 opacity-50"
            style={{ transform: `translateY(${scanHeight}px)` }}
          />
        </div>

        {/* Medical-themed message */}
        <p className="text-xl text-blue-600 mb-12 font-light">
          The medication you're looking for is currently out of stock in our
          digital pharmacy.
        </p>

        {/* Interactive buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Return to Homepage</span>
              <svg
                className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="/"
            className="group relative px-8 py-4 bg-white text-blue-500 border-2 border-blue-500 rounded-full font-medium overflow-hidden transition-all duration-300 hover:bg-blue-50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>Find Nearest Pharmacy</span>
              <svg
                className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Medical stats */}
        <div className="mt-16 flex justify-center gap-8 text-blue-600/70 font-mono text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider mb-1">
              Error Code
            </div>
            <div className="font-medium">RX_404</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-1">Status</div>
            <div className="font-medium">NOT_FOUND</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-1">
              Timestamp
            </div>
            <div className="font-medium">{timestamp}</div>
          </div>
        </div>
      </div>

      {/* Mouse follower */}
      <div
        className="fixed w-64 h-64 pointer-events-none mix-blend-multiply"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          transition: "all 0.1s ease-out",
        }}
      />

      {/* Animated scan line */}
      <div
        className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"
        style={{
          transform: `translateY(${scanHeight}vh)`,
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
}
