"use strict";

import React from 'react';
import Tasks from './tasks';
import NewTaskButton from './newTaskButton';
import NewTaskForm from './newTaskForm';
import Update from './update';
import {swipe} from './touchEvents';
import request from '../request';
import {addTask, turnUpdatingOn, turnUpdatingOff} from '../action';

export default ({store}) => {
    const {tasks, isAddNewTaskFormVisible, isUpdating} = store.getState();
    function onTouchStart(e) {
        swipe(e, 'down', function () {
            store.dispatch(turnUpdatingOn());
            request('GET', '/tasks', null, function (err, tasks) {
                if (err) {
                    console.error(err);
                } else {
                    tasks.forEach(task => store.dispatch(addTask(task)));
                    store.dispatch(turnUpdatingOff());
                }
            });
        });
    }

    return (
        <div className="wrapper" onTouchStart={onTouchStart}>
            {function () {
                if (isUpdating) {
                    return <Update/>;
                }
            }.call(this)}
            <Tasks tasks={tasks} store={store}/>
            {function () {
                if (isAddNewTaskFormVisible) {
                    return <NewTaskForm store={store}/>;
                }
                return <NewTaskButton store={store}/>;
            }.call(this)}
        </div>
    );
};
