$(document).ready(() => {
    var stats = [
        ['Age', '23'],
        ['Years In Industry', '2'],
        ['Main Languages', 'Java, Python, Javascript'],
        ['Life Director', 'Jeremiah 29:11']
    ]
    populateStats(stats)
})

/**
 * Populate the stats section.
 * 
 * @param {string[][]} stats 
 */
async function populateStats(stats: string[][]) {
    var statsList = $('.stats-list')

    stats.forEach(stat => {
        var title = stat[0]
        var value = stat[1]

        var item = $('<li>')
        item.append($(`<h2>${title}:</h2>`))
        item.append($(`<span>${value}</span>`))
        statsList.append(item)
    })
}

