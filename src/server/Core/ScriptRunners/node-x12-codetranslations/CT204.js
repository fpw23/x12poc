/* eslint-disable indent */

// Translate S502 ELIGIBILITY BENEFIT Code
export const TranslateS502Code = (typecode) => {
    let returnvalue = typecode
    switch (typecode) {
        case 'CU': returnvalue = 'Complete Unload'; break
        case 'LD': returnvalue = 'Load'; break
        case 'PL': returnvalue = 'Part Load'; break
        case 'PU': returnvalue = 'Part Unload'; break
        case 'UL': returnvalue = 'Unload'; break
    }
    return returnvalue
}
