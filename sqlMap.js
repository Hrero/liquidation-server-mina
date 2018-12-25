// sql语句
var sqlMap = {
    addCompany: {
        add: 'insert into company(name, number, region, isGoOut, hopeGoOut, existence, diss, talk, star) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?);'
    },
    user: {
        login: 'SELECT userpsw FROM admin WHERE username = ?;',
    },
    disclose: {
        disclose: 'SELECT * FROM diss'
    },
    ranking: {
        ranking: 'SELECT * FROM company order by star desc'
    },
    repetition: {
        companyName: 'SELECT name, COUNT( name ) FROM company GROUP BY name HAVING COUNT( name )'
    },
    name: function(x) {
    	return `SELECT * FROM company WHERE name='${x}'`
    }
}

module.exports = sqlMap