'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VIDEOS = [
  { src: '/studio-entry.mp4',   label: 'EL PROCESO · DE PRINCIPIO A FIN', line1: 'Nos conocemos.', line2: 'Cuéntanos tu proyecto.' },
  { src: '/studio-design.mp4',  label: 'FASE 01 · DISEÑO',                 line1: 'Diseñamos tu',   line2: 'identidad visual.' },
  { src: '/studio-meeting.mp4', label: 'FASE 02 · ITERACIÓN',              line1: 'Lo revisamos juntos.', line2: 'Hasta que sea perfecto.' },
  { src: '/studio-tech.mp4',    label: 'FASE 03 · ENTREGA',                line1: 'Lo construimos.', line2: 'Lo lanzamos. En semanas.' },
]

const FADE = 0.04

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null, null])
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const lastTime = useRef<number[]>([0, 0, 0, 0])
  const [allReady, setAllReady] = useState(false)

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[]
    if (videos.length === 0) return

    let readyCount = 0
    const total = videos.length
    let trigger: ScrollTrigger | null = null

    const prebuffer = (videoIndex: number, time: number) => {
      const v = videoRefs.current[videoIndex]
      if (v && v.readyState >= 2) {
        v.currentTime = time
        lastTime.current[videoIndex] = time
      }
    }

    const initScrollTrigger = () => {
      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`
          }

          const segment = p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3

          if (p > 0.22 && p < 0.25) prebuffer(1, 0)
          if (p > 0.47 && p < 0.50) prebuffer(2, 0)
          if (p > 0.72 && p < 0.75) prebuffer(3, 0)

          videoRefs.current.forEach((v, i) => {
            if (!v) return
            if (i === segment) {
              v.style.opacity = '1'
            } else {
              v.style.opacity = '0'
              if (!v.paused) v.pause()
            }
          })

          const active = videoRefs.current[segment]
          if (active && active.duration && isFinite(active.duration)) {
            const segP = Math.max(0, Math.min(1, (p - segment * 0.25) / 0.25))
            const newTime = segP * active.duration
            if (Math.abs(newTime - lastTime.current[segment]) > 0.05) {
              active.currentTime = newTime
              lastTime.current[segment] = newTime
            }
          }

          overlayRefs.current.forEach((el, i) => {
            if (!el) return
            const start = i * 0.25
            const fadeInEnd = start + FADE
            const holdEnd = start + 0.25 - FADE
            const fadeOutEnd = start + 0.25

            let opacity = 0
            if (i === 0 && p < fadeInEnd) {
              opacity = 1
            } else if (p >= start && p < fadeInEnd) {
              opacity = (p - start) / FADE
            } else if (p >= fadeInEnd && p < holdEnd) {
              opacity = 1
            } else if (p >= holdEnd && p < fadeOutEnd) {
              opacity = 1 - (p - holdEnd) / FADE
            }

            el.style.opacity = String(opacity)
            el.style.pointerEvents = opacity > 0 ? 'auto' : 'none'
          })
        },
      })
      setAllReady(true)
    }

    videos.forEach((v) => {
      v.muted = true
      v.preload = 'auto'

      const onReady = () => {
        readyCount++
        if (readyCount === total) initScrollTrigger()
      }

      if (v.readyState >= 3) {
        onReady()
      } else {
        v.addEventListener('canplay', onReady, { once: true })
        v.load()
      }
    })

    return () => {
      trigger?.kill()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      style={{ height: '800vh', position: 'relative' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: '#0D0D0B',
        willChange: 'transform',
      }}>

        {VIDEOS.map((v, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el }}
            src={v.src}
            muted
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === 0 ? 1 : 0,
              transition: 'opacity 0.5s ease',
              willChange: 'opacity',
            }}
          />
        ))}

        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(13,13,11,0.55) 0%,
            rgba(13,13,11,0.05) 25%,
            transparent 45%,
            rgba(13,13,11,0.15) 65%,
            rgba(13,13,11,0.82) 100%
          )`,
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        <nav style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}>
          <span style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: '#FAFAF8',
          }}>UMANIA LABS</span>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['WORK', 'PROCESS', 'CONTACT'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: '11px',
                fontWeight: 300,
                letterSpacing: '0.2em',
                color: 'rgba(250,250,248,0.55)',
                textDecoration: 'none',
              }}>{item}</a>
            ))}
          </div>
        </nav>

        {VIDEOS.map((v, i) => (
          <div
            key={i}
            ref={el => { overlayRefs.current[i] = el }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: 'clamp(20px, 5vw, 40px)',
              right: 'clamp(20px, 5vw, 40px)',
              width: '90vw',
              overflow: 'hidden',
              zIndex: 10,
              opacity: i === 0 ? 1 : 0,
              pointerEvents: 'none',
              transition: 'none',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: 'clamp(8px, 2vw, 10px)',
              letterSpacing: 'clamp(0.1em, 0.25em, 0.25em)',
              color: 'rgba(250,250,248,0.55)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>{v.label}</p>
            <p style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(32px, 8vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.0,
              color: '#FAFAF8',
              margin: 0,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
            }}>{v.line1}</p>
            <p style={{
              fontFamily: 'var(--font-syne)',
              fontSize: 'clamp(32px, 8vw, 72px)',
              fontWeight: 300,
              lineHeight: 1.0,
              color: 'rgba(250,250,248,0.65)',
              margin: 0,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
            }}>{v.line2}</p>
          </div>
        ))}

        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '2px',
          background: 'rgba(250,250,248,0.1)',
          zIndex: 10,
        }}>
          <div
            ref={progressBarRef}
            style={{
              height: '100%',
              background: '#C8A96E',
              transformOrigin: 'left center',
              transform: 'scaleX(0)',
            }}
          />
        </div>

        {!allReady && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#0D0D0B',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '120px',
              height: '1px',
              background: 'rgba(250,250,248,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: '#C8A96E',
                animation: 'loading 1.2s ease-in-out infinite',
              }} />
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
