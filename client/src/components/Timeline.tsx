import React from 'react'

export type TimelineItem = {
  time?: string
  text: string
}

export type TimelineDay = {
  dateLabel: string
  items: TimelineItem[]
}

export function Timeline({ timeline }: { timeline: TimelineDay[] }) {
  return (
    <div className="timeline">
      {timeline.map((day) => (
        <div key={day.dateLabel} className="timeline-day">
          <h3>{day.dateLabel}</h3>
          <ul>
            {day.items.map((item, idx) => (
              <li key={idx}>
                {item.time ? <span className="time">{item.time}</span> : null}
                <span className="text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
} 