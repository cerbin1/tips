export default class AdviceService {
    static getAdviceDetailsById(adviceId) {
        return {
            id: adviceId,
            name: "Nazwa porady",
            ranking: 5,
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        };
    }

    static getAllCategories() {
        return [
            {
                id: 1,
                advicesCount: 15,
                name: "Rozwój osobisty",
            },
            {
                id: 2,
                advicesCount: 102,
                name: "Dom",
            },
            {
                id: 3,
                advicesCount: 52,
                name: "Praca",
            },
            {
                id: 4,
                advicesCount: 0,
                name: "Zwierzęta",
            },
        ];
    }

    static getAdvicesByCategory(categoryId) {
        const advicesByCategory = [
            {
                categoryId: "1",
                name: "Rozwój osobisty",
                advices: [
                    {
                        id: 1,
                        name: "Porada 1",
                        ranking: 0,
                    },
                    {
                        id: 2,
                        name: "Porada 2",
                        ranking: 54,
                    },
                    {
                        id: 3,
                        name: "Porada 3",
                        ranking: 15,
                    },
                    {
                        id: 4,
                        name: "Porada 4",
                        ranking: 25,
                    },
                    {
                        id: 5,
                        name: "Porada 5",
                        ranking: 123,
                    },
                ]
            },
            {
                categoryId: "2",
                name: "Dom",
                advices: [
                    {
                        id: 6,
                        name: "Porada 6",
                        ranking: 1,
                    },
                    {
                        id: 7,
                        name: "Porada 7",
                        ranking: 4,
                    },
                    {
                        id: 8,
                        name: "Porada 8",
                        ranking: 2,
                    },
                    {
                        id: 9,
                        name: "Porada 9",
                        ranking: 7,
                    },
                    {
                        id: 10,
                        name: "Porada 10",
                        ranking: 0,
                    },
                ]
            },
            {
                categoryId: "3",
                name: "Praca",
                advices: [
                    {
                        id: 11,
                        name: "Porada 11",
                        ranking: 12,
                    },
                    {
                        id: 12,
                        name: "Porada 12",
                        ranking: 4,
                    },
                    {
                        id: 13,
                        name: "Porada 13",
                        ranking: 0,
                    },
                    {
                        id: 14,
                        name: "Porada 14",
                        ranking: 42,
                    },
                    {
                        id: 15,
                        name: "Porada 15",
                        ranking: 124,
                    },
                ]
            }, {
                categoryId: "4",
                name: "Zwierzęta",
                advices: []
            },
        ];
        return advicesByCategory.find(advicesByCategory => advicesByCategory.categoryId.toString() === categoryId.toString())
    }

    static getTop10Advices() {
        const top10Advices =
            [
                {
                    id: 1,
                    name: "Porada 1",
                    ranking: 89234,
                },
                {
                    id: 2,
                    name: "Porada 2",
                    ranking: 1242,
                },
                {
                    id: 3,
                    name: "Porada 3",
                    ranking: 523,
                },
                {
                    id: 4,
                    name: "Porada 4",
                    ranking: 423,
                },
                {
                    id: 5,
                    name: "Porada 5",
                    ranking: 231,
                },
                {
                    id: 6,
                    name: "Porada 6",
                    ranking: 120,
                },
                {
                    id: 7,
                    name: "Porada 7",
                    ranking: 112,
                },
                {
                    id: 8,
                    name: "Porada 8",
                    ranking: 86,
                },
                {
                    id: 9,
                    name: "Porada 9",
                    ranking: 74,
                },
                {
                    id: 10,
                    name: "Porada 10",
                    ranking: 52,
                },
            ];

        return top10Advices;
    }
}
