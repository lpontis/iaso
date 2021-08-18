import { iasoApp } from './index.tsx';

describe('Main app component', () => {
    it('mount properly', () => {
        const app = document.createElement('DIV');
        app.id = 'app';
        expect(iasoApp(app, [])).to.be.undefined;
    });
});
