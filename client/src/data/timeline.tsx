import React from 'react'
import type { TimelineDay } from '../components/Timeline'

const link = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noreferrer">{label}</a>
)

export const weddingTimeline: TimelineDay[] = [
  {
    dateLabel: '09.08.2025',
    items: [
      {
        time: '10:00',
        content: (
          <>
            Сбор гостей и трансфер из Калининграда в ЗАГС (
            {link('https://yandex.ru/maps/-/CHhU66J9', 'г. Калининград, ул. Героя России Виталия Мариенко, 2')}
            )
          </>
        ),
      },
      {
        time: '12:00',
        content: (
          <>
            Сбор у ЗАГСа в Зеленоградске (
            {link('https://yandex.ru/maps/org/otdel_zags_administratsii_mo_zelenogradskiy_gorodskoy_okrug/1058568608?si=6z5bpuqqe3x47dbdkrea76gqh8', 'г. Зеленоградск, Отдел ЗАГС администрации МО «Зеленоградский городской округ»')}
            , {link('https://yandex.ru/maps/-/CHhUZO67', 'ссылка 2')}
            )
          </>
        ),
      },
      { time: '12:30', text: 'Торжественная регистрация брака в ЗАГСе' },
      { time: '13:00–15:00', text: 'Фотосессия с гостями и отдельные кадры пары в г. Зеленоградск' },
      { time: '15:00', text: 'Переезд в коттедж' },
      { time: '16:00–21:00', text: 'Праздничный банкет и шоу‑программа ведущего' },
      { time: '21:00', text: 'Танцы и свободное общение (вечеринка)' },
    ],
  },
  {
    dateLabel: '10.08.2025',
    items: [
      { time: 'с утра — 21:00', text: 'Барбекю и отдых' },
    ],
  },
] 