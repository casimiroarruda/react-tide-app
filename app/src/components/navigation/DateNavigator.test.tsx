// src/components/navigation/DateNavigator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DateNavigator } from './DateNavigator'
import { toApiDate, addDays, formatStripDate } from '@/utils/date'

describe('DateNavigator', () => {
    const today = toApiDate(new Date())
    const tomorrow = addDays(today, 1)

    it('deve renderizar os chips de data para os próximos 7 dias', () => {
        render(
            <DateNavigator 
                selectedDate={today} 
                onDateChange={() => {}} 
            />
        )

        // Verifica se hoje e amanhã estão presentes
        expect(screen.getByText(formatStripDate(today, 'UTC'))).toBeInTheDocument()
        expect(screen.getByText(formatStripDate(tomorrow, 'UTC'))).toBeInTheDocument()
        
        // Deve haver 7 botões
        const buttons = screen.getAllByRole('button')
        expect(buttons).toHaveLength(7)
    })

    it('deve destacar a data selecionada', () => {
        render(
            <DateNavigator 
                selectedDate={tomorrow} 
                onDateChange={() => {}} 
            />
        )

        const activeItem = screen.getByText(formatStripDate(tomorrow, 'UTC'))
        const button = activeItem.closest('button')
        
        // O botão selecionado tem data-active="true" e classe com fundo escuro
        expect(button).toHaveAttribute('data-active', 'true')
        expect(button).toHaveClass('bg-[#0B3950]')
    })

    it('deve chamar onDateChange ao clicar em uma data', () => {
        const onDateChange = vi.fn()
        render(
            <DateNavigator 
                selectedDate={today} 
                onDateChange={onDateChange} 
            />
        )

        const tomorrowBtn = screen.getByText(formatStripDate(tomorrow, 'UTC'))
        fireEvent.click(tomorrowBtn)

        expect(onDateChange).toHaveBeenCalledWith(tomorrow)
    })
})
