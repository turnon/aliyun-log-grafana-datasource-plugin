export var defaultQuery = {
    query: '* | select count(*) as c, __time__-__time__%60 as t group by t',
    xcol: 't',
    ycol: 'c',
    logsPerPage: 100,
    currentPage: 1,
};
//# sourceMappingURL=types.js.map