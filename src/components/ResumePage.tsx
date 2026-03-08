import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { resume } from '../config/resume'
import { useScrollProgress } from '../hooks/useScrollProgress'
import ThemeToggle from './ThemeToggle'

export default function ResumePage() {
  const navigate = useNavigate()
  const progressRef = useRef<HTMLDivElement>(null)

  useScrollProgress(progressRef)

  return (
    <main className="app app--top">
      <div className="scroll-progress" ref={progressRef} />
      <div className="resume">
        <button className="resume-back" onClick={() => navigate('/')}>
          <span className="resume-back-arrow">←</span> links
        </button>
        <ThemeToggle />

        <header className="resume-header">
          <h1 className="resume-name">{resume.name}</h1>
          <p className="resume-contact">
            {resume.location} &middot;{' '}
            <a href={`mailto:${resume.email}`} className="resume-email">
              {resume.email}
            </a>
          </p>
        </header>

        {/* Education */}
        <section className="resume-section" style={{ animationDelay: '80ms' }}>
          <h2 className="resume-section-title">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-header">
                <span className="resume-entry-org">
                  {edu.school}
                  {edu.location && <>, {edu.location}</>}
                </span>
                {edu.year && <span className="resume-entry-period">{edu.year}</span>}
              </div>
              <p className="resume-entry-detail">{edu.degree}</p>
            </div>
          ))}
        </section>

        {/* Professional Experience */}
        <section className="resume-section" style={{ animationDelay: '160ms' }}>
          <h2 className="resume-section-title">Professional Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="resume-company">
              <div className="resume-company-header">
                <span className="resume-entry-org">{exp.company}</span>
                <span className="resume-entry-location">{exp.location}</span>
              </div>
              {exp.roles.map((role, j) => (
                <div key={j} className="resume-role">
                  <div className="resume-role-header">
                    <span className="resume-role-title">{role.title}</span>
                    <span className="resume-entry-period">{role.period}</span>
                  </div>
                  <ul className="resume-bullets">
                    {role.bullets.map((bullet, k) => (
                      <li key={k}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Additional Experience */}
        <section className="resume-section" style={{ animationDelay: '240ms' }}>
          <h2 className="resume-section-title">Additional Experience</h2>
          {resume.additionalExperience.map((item, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-header">
                <span className="resume-role-title">{item.title}</span>
                <span className="resume-entry-period">{item.period}</span>
              </div>
              <p className="resume-entry-detail">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="resume-section" style={{ animationDelay: '320ms' }}>
          <h2 className="resume-section-title">Skills</h2>
          <ul className="resume-simple-list">
            {resume.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* Awards & Honors */}
        <section className="resume-section" style={{ animationDelay: '400ms' }}>
          <h2 className="resume-section-title">Awards &amp; Honors</h2>
          <ul className="resume-simple-list">
            {resume.awards.map((award, i) => (
              <li key={i}>{award}</li>
            ))}
          </ul>
        </section>

        {/* Interests */}
        <section className="resume-section" style={{ animationDelay: '480ms' }}>
          <h2 className="resume-section-title">Interests</h2>
          <ul className="resume-simple-list">
            {resume.interests.map((interest, i) => (
              <li key={i}>{interest}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
