import ReactNativeForegroundService from '@supersami/rn-foreground-service';
////////////////////////////////////////////////////
export const startForeground = ({
    title = 'foreground service',
    message = 'meetoor app',
    meter = false,
    button = false,
    buttonText = 'close meetoor',
    buttonType = "endService"
}) => {
    if (ReactNativeForegroundService.is_task_running('meetoorTask')) return;
    ReactNativeForegroundService
        .add_task(() => console.log('foreground'), {
            onLoop: true,
            taskId: 'meetoorTask',
            onError: (e) => console.log(`Error logging:`, e),
        });

    return ReactNativeForegroundService.start({
        id: 161994,
        title,
        message,
        meter,
        button,
        buttonText,
        buttonOnPress: buttonType
    });
};

export const stopForeground = () => {
    if (ReactNativeForegroundService.is_task_running('meetoorTask')) {
        ReactNativeForegroundService.remove_task('meetoorTask');
    }
    return ReactNativeForegroundService.stop();
};