"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "./Nav.jsx";
import PageHeading from "./PageHeading.jsx";
import AnimatedCardGrid from "./AnimatedCardGrid.jsx";
import { home } from "../data/site.js";
const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function HomeView() {
  const [data, setData] = useState(home);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API}/api/profile`);
        if (!res.ok) {
          throw new Error(`主页数据加载失败：${res.status}`);
        }
        setData(await res.json());
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  return (
    <AnimatedCardGrid className="dashboard-grid">
      <article className="hero-stage panel-full">
        <Nav />
        <PageHeading title={data.heroTitle} subtitle={data.heroSubtitle} />
      </article>

      <article className="panel panel-full featured-work-panel card">
        <p className="section-kicker">{data.featuredWork.kicker}</p>
        <p className="featured-title">{data.featuredWork.title}</p>
        <p className="featured-copy">{data.featuredWork.copy}</p>
        <Link className="featured-link" href="/text-lab">
          <span className="featured-link-label">{data.featuredWork.linkLabel}</span>
          <span className="arrow">›</span>
        </Link>
      </article>

      <article className="panel panel-full identity-panel card">
        <div className="identity-item">
          <p className="section-kicker">座右铭</p>
          <p className="identity-value identity-quote">{data.identity.motto}</p>
        </div>
        <div className="identity-item">
          <p className="section-kicker">正在学习</p>
          <p className="identity-value">{data.identity.learning}</p>
        </div>
      </article>
    </AnimatedCardGrid>
  );
}
