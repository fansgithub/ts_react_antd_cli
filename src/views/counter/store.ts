
import {observable, action} from 'mobx';

class CounterStore{
    @observable
    num: number = 0;

    @action
    increase = () => {
        this.num += 1;
    }

    @action
    decrease = () => {
        this.num -= 1;
    }
}

export default new CounterStore();