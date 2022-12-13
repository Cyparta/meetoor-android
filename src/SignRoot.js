import React, { memo, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Sign from './components/sign/sign';
///////////////////////////////////////////////
let Signup = null;
let Signin = null;
let Forget = null;
let Reset = null;
let WriteAnonyChatMeetoor = null;
//////////////////////////////////////////////////
const Stack = createNativeStackNavigator();
class SignRootNavigation extends React.PureComponent {
    StackScreenSignup = () => {
        if (Signup === null) {
            Signup = require('./components/sign/signup').default;
        }
        return (<Sign><Signup /></Sign>)
    }
    StackScreenSignin = () => {
        if (Signin === null) {
            Signin = require('./components/sign/signin').default;
        }
        return (<Sign><Signin /></Sign>)
    }
    StackScreenResetPassword = ({ route: { params } }) => {
        if (Reset === null) {
            Reset = require('./components/sign/reset').default;
        }
        return (<Sign><Reset {...params} /></Sign>)
    }
    StackScreenForget = () => {
        if (Forget === null) {
            Forget = require('./components/sign/forget').default;
        }
        return (<Sign><Forget /></Sign>)
    }
    StackScreenWriteAnonyChatMeetoor = ({ route: { params } }) => {
        if (WriteAnonyChatMeetoor === null) {
            WriteAnonyChatMeetoor = require('./components/posts/createpost/writeanonychat').default;
        }
        return (<WriteAnonyChatMeetoor {...params} />)
    }
    render() {
        return (<Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="signup">
                {this.StackScreenSignup}
            </Stack.Screen>
            <Stack.Screen name="signin">
                {this.StackScreenSignin}
            </Stack.Screen>
            <Stack.Screen name="reset_password">
                {this.StackScreenResetPassword}
            </Stack.Screen>
            <Stack.Screen name="forget">
                {this.StackScreenForget}
            </Stack.Screen>
            <Stack.Screen name="writeanonychat">
                {this.StackScreenWriteAnonyChatMeetoor}
            </Stack.Screen>
        </Stack.Navigator>)
    }
}
const SignRoot = ({ openApp }) => {
    const navigation = useNavigation();
    /////////////////////////////////////////
    useEffect(() => {
        if (openApp) {
            navigation.navigate(openApp.nav, openApp.props);
        }
    }, [openApp]);
    /////////////////////////////////////////
    return (<SignRootNavigation />)
}

export default memo(SignRoot);