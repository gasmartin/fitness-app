import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Card from './Card';


const ActivityDashboard = (props) => {
    return (
        <Card>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Calorias consumidas no dia:{" "}
                    </Text>
                    {props.netCalories || 0} kcal
                </Text>
                <Text style={{ fontSize: 18 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Meta de calorias do dia:{" "}
                    </Text>
                    {props.goalCalories || 0} kcal
                </Text>
                {/* <AnimatedCircularProgress
                    size={120}
                    width={12}
                    fill={consumedCaloriesFill}
                    tintColor="#FF6624"
                    backgroundColor="#3d5875"
                >
                    {
                        () => (
                            <Text style={{ fontSize: 24 }}>
                                {consumedCalories} / {user.goal_calories}
                            </Text>
                        )
                    }
                </AnimatedCircularProgress> */}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default ActivityDashboard;