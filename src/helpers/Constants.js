export const hours = [
    { label: '01', value: 1 },
    { label: '02', value: 2 },
    { label: '03', value: 3 },
    { label: '04', value: 4 },
    { label: '05', value: 5 },
    { label: '06', value: 6 },
    { label: '07', value: 7 },
    { label: '08', value: 8 },
    { label: '09', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12', value: 12 },
]

export const minutes =()=>{
    let array = []
    for (let i = 0;i<60;i++){
        array.push( { label: i<9 ? '0' + i : ''+i, value: i })
    }
    return array
}

export const AMPM = [
    { label: 'AM', value: 0 },
    { label: 'PM', value: 1 },
]

export const type = [
    { label: 'IN', value: 0 },
    { label: 'OUT', value: 1 },
    { label: 'NAP', value: 2 },
]