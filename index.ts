import { Constructor, Library } from "@wowts/tslib";
import { CreateFrame, UIFrame } from "@wowts/wow-mock";
import { LuaArray, ipairs } from "@wowts/lua";
import { insert as tinsert } from "@wowts/table";

export interface AceModule {
    GetName?(): string;
    OnInitialize?(): void;
}

export interface Addon {
    NewModule(name: string) : Constructor<AceModule>;
    NewModule<T>(name: string, dep1: Library<T>) : Constructor<AceModule & T>;
    NewModule<T, U>(name: string, dep1: Library<T>, dep2: Library<U>) : Constructor<AceModule & T & U>;
    NewModule<T, U, V>(name: string, dep1: Library<T>, dep2: Library<U>, dep3: Library<V>): Constructor<AceModule & T & U & V>;
    NewModule<T, U, V, W>(name: string, dep1: Library<T>, dep2: Library<U>, dep3: Library<V>, dep4: Library<W>): Constructor<AceModule & T & U & V & W>;
    GetName():string;
    OnInitialize?():void;
}

/** Creates a new addon
 * @param name Must be the add-on name, as defined in the .toc file
 * @param depency A dependency
 */
export function NewAddon(name: string): Constructor<Addon>;
export function NewAddon<T>(name: string, dep1:Library<T>): Constructor<Addon & T>;
export function NewAddon<T, U>(name: string, dep1:Library<T>, dep2: Library<U>): Constructor<Addon & T & U>
export function NewAddon<T, U>(name: string, dep1?:Library<T>, dep2?: Library<U>): Constructor<Addon & T & U> | Constructor<Addon & T> | Constructor<Addon> {
    const BaseClass = class {
        private modules: LuaArray<AceModule> = {};

        constructor(...args:any[]) {
            const frame = CreateFrame("Frame", "tslibframe");
            frame.RegisterEvent("ADDON_LOADED");
            frame.SetScript("OnEvent", (self: UIFrame, event: string, addon: string) => {
                if (addon !== name) return;
                this.OnInitialize();
                for (const [,module] of ipairs(this.modules)) {
                    if (module.OnInitialize) {
                        module.OnInitialize();
                    }
                }
            })
        }
        OnInitialize(){}
        NewModule<T, U, V, W>(name: string, dep1?: Library<T>, dep2?: Library<U>, dep3?: Library<V>, dep4?: Library<W>) {
            const addon = this;
            const BaseModule = class {
                constructor() {
                    tinsert(addon.modules, this);
                }
                GetName() {
                    return name;
                }
            };
            if (dep1) {
                if (dep2) {
                    if (dep3) {
                        if (dep4) {
                            return dep1.Embed(dep2.Embed(dep3.Embed(dep4.Embed(BaseModule))));
                        }
                        return dep1.Embed(dep2.Embed(dep3.Embed(BaseModule)));
                    }                    
                    return dep1.Embed(dep2.Embed(BaseModule));
                }
                return dep1.Embed(BaseModule);
            }
            return BaseModule;
        }
        GetName() {
            return name;
        }
    };

    if (dep1) {
        if (dep2) {
            return dep2.Embed(dep1.Embed(BaseClass));
        }
        return dep1.Embed(BaseClass);
    }
    return BaseClass;
}
