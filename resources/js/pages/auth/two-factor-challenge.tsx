import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function TwoFactorChallenge() {
    const [mode, setMode] = useState<'code' | 'recovery_code'>('code');
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('two-factor.login'), {
            onFinish: () => reset('code', 'recovery_code'),
        });
    };

    const switchMode = (next: 'code' | 'recovery_code') => {
        setMode(next);
        setData('code', '');
        setData('recovery_code', '');
    };

    return (
        <AuthLayout
            title="المصادقة الثنائية"
            description="أدخل رمز التحقق من تطبيق المصادقة أو رمز الاسترداد للمتابعة."
        >
            <Head title="المصادقة الثنائية" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor={mode}>
                            {mode === 'code' ? 'رمز التحقق' : 'رمز الاسترداد'}
                        </Label>
                        <Input
                            id={mode}
                            name={mode}
                            inputMode={mode === 'code' ? 'numeric' : 'text'}
                            autoComplete="one-time-code"
                            autoFocus
                            placeholder={
                                mode === 'code' ? '6 أرقام' : 'رمز الاسترداد'
                            }
                            value={data[mode]}
                            onChange={(e) => setData(mode, e.target.value)}
                        />
                        <InputError
                            message={errors.code || errors.recovery_code}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        تسجيل الدخول
                    </Button>
                </div>

                <div className="text-center text-sm">
                    <button
                        type="button"
                        className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                        onClick={() =>
                            switchMode(
                                mode === 'code' ? 'recovery_code' : 'code',
                            )
                        }
                    >
                        {mode === 'code'
                            ? 'استخدم رمز الاسترداد'
                            : 'استخدم رمز التحقق'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
