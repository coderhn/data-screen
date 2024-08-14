const data = [
    {
        parent: 3,
        id: 4,
        value: 4,
    },
    {
        parent: null,
        id: 1,
        value: 1,
    },
    {
        parent: 1,
        id: 2,
        value: 2,
    },
    {
        parent: 1,
        id: 3,
        value: 3,
    }
];

const transTreeData = (data, parentId = null) => {
    const parent = data.filter((d) => d.parent === parentId);
    return parent.map((d) => {
        return { ...d, children: transTreeData(data.filter((item) => item.parent !== parentId), d.id) }
    })
}

