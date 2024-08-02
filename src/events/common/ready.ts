import { ActivityType } from 'discord.js';
import IEvent from '../../interfaces/IEvent';

const ready: IEvent<'ready'> = {
    name: 'ready',
    once: true,

    execute: (client) => {
        console.log(`${client.user.tag} đã sẵn sàng`);

        client.user.setPresence({
            status: 'online',
            activities: [{ name: 'Hồng Đức code', type: ActivityType.Watching }],
        });
    },
};

export default ready;
