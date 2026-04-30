import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import styles from "./CV.module.css";

export default function CV() {
  const [profile, setProfile] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("profile").select("*").single(),
      supabase.from("work_history").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("certifications").select("*").order("sort_order"),
      supabase.storage
        .from("cv")
        .list("", {
          limit: 1,
          sortBy: { column: "created_at", order: "desc" },
        }),
    ]).then(([p, w, s, c, cv]) => {
      setProfile(p.data);
      setWorkHistory(w.data || []);
      setSkills(s.data || []);
      setCertifications(c.data || []);
      if (cv.data && cv.data.length > 0) {
        const { data } = supabase.storage
          .from("cv")
          .getPublicUrl(cv.data[0].name);
        setCvUrl(data.publicUrl);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const languages = [
    { name: "IsiZulu", level: "Native / Bilingual" },
    { name: "English", level: "Native / Bilingual" },
    { name: "IsiXhosa", level: "Limited Working" },
    { name: "Sesotho", level: "Limited Working" },
  ];

  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.name}>{profile?.name}</h1>
          <p className={styles.title}>{profile?.title}</p>
          <div className={styles.contacts}></div>
        </div>
        {cvUrl && (
          <a href={cvUrl} download className={styles.dlBtn}>
            Download .docx
          </a>
        )}
      </div>

      <div className={styles.body}>
        {profile?.statement && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Profile</h2>
            <p className={styles.statement}>{profile.statement}</p>
          </section>
        )}

        {workHistory.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Experience</h2>
            {workHistory.map((job) => (
              <div key={job.id} className={styles.job}>
                <div className={styles.jobHeader}>
                  <span className={styles.jobTitle}>{job.role}</span>
                  <span className={styles.jobDate}>
                    {job.start_date} –{" "}
                    {job.is_current ? "Present" : job.end_date}
                  </span>
                </div>
                <div className={styles.jobOrg}>
                  {job.org}
                  {job.location ? ` · ${job.location}` : ""}
                </div>
                {job.bullets && job.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {job.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {skills.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Skills</h2>
            <div className={styles.skillsGrid}>
              {skills.map((s) => (
                <div key={s.id} className={styles.skillCard}>
                  <div className={styles.skillCategory}>
                    {s.category.charAt(0).toUpperCase() + s.category.slice(1)}
                  </div>
                  <div className={styles.skillTags}>
                    {s.tags.map((tag, i) => (
                      <span key={i} className={styles.skillTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className={styles.certRow}>
                <div className={styles.certDot} />
                <div>
                  <div className={styles.certName}>{cert.name}</div>
                  <div className={styles.certIssuer}>
                    {cert.issuer}
                    {cert.year ? ` · ${cert.year}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Languages</h2>
          <div className={styles.langRow}>
            {languages.map((l, i) => (
              <div key={i} className={styles.langItem}>
                <div className={styles.langName}>{l.name}</div>
                <div className={styles.langLevel}>{l.level}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
