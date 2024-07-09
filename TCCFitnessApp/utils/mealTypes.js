export const MealTypes = Object.freeze({
    BREAKFAST: 'breakfast',
    LUNCH: 'lunch',
    DINNER: 'dinner',
    SNACKS: 'snack'
});


export const getMealTypeTranslation = (mealType) => {
    const translations = {
        [MealTypes.BREAKFAST]: 'Café da manhã',
        [MealTypes.LUNCH]: 'Almoço',
        [MealTypes.DINNER]: 'Jantar',
        [MealTypes.SNACKS]: 'Lanche'
    };

    return translations[mealType] || 'Tipo de refeição desconhecido';
};

export const mealTypeItems = Object.entries(MealTypes).map(([_, value]) => ({
    label: getMealTypeTranslation(value),
    value
}));