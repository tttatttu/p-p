import React, { Suspense, useEffect } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { useTheme } from 'app/providers/ThemeProvider';
import { AppRouter } from 'app/providers/router';
import { Navbar } from 'widgets/Navbar';
import { Sidebar } from 'widgets/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInited, userActions } from 'entities/User';
import { defineStore } from '../../json-server/store';

function App() {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const inited = useSelector(getUserInited);

    useEffect(() => {
        dispatch(userActions.initAuthData());
    }, [dispatch]);

    return (
        <div className={classNames('app', {}, [theme])}>
            <Suspense fallback="">
                <Navbar />
                <div className="content-page">
                    <Sidebar />
                    {inited && <AppRouter />}
                </div>
            </Suspense>
        </div>
    );
}

export default App;

const reducer = (currentState: any, action: any) => {
    switch (action.type) {
    case 'increment': {
        return { ...currentState, count: action.payload };
    }
    default: return currentState;
    }
};
const store = defineStore(reducer, { count: 1 });

console.log('1', store.getState());

store.dispatch({ type: 'increment', payload: 5 });

console.log('2', store.getState());

store.dispatch({ type: 'incrementttt', payload: 10 });

console.log('3', store.getState());
