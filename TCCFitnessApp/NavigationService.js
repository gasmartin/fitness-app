import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}

export function reset(routes = [{ name: 'Login' }]) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.reset({ index: 0, routes }));
    }
}