import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import Card from './Card';


const Dashboard = ({ dashboardInfo }) => {
    return (
        <Card>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>
                    Dashboard
                </Text>
                <Text style={{ fontSize: 18 }}>
                    Consumed calories: {dashboardInfo.consumedCalories || 0}
                </Text>
                <Text style={{ fontSize: 18 }}>
                    Goal calories: {dashboardInfo.goalCalories || 0}
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

export default Dashboard;